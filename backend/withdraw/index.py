import json
import os
import psycopg2
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Process withdrawal requests and send Telegram notifications
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    phone_number = body_data.get('phoneNumber', '')
    bank_name = body_data.get('bankName', '')
    amount = body_data.get('amount', 0)
    user_balance = body_data.get('userBalance', 0)
    
    if not phone_number or not bank_name or not amount:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    if amount > user_balance:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Insufficient balance'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    admin_chat_id = os.environ.get('TELEGRAM_ADMIN_CHAT_ID')
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO withdrawals (user_id, phone_number, bank_name, amount, status) VALUES (NULL, %s, %s, %s, 'pending') RETURNING id",
        (phone_number, bank_name, amount)
    )
    withdrawal_id = cur.fetchone()[0]
    conn.commit()
    
    message = f"""
🔔 <b>Новая заявка на вывод!</b>

💰 Сумма: <b>{amount} ₽</b>
📱 Телефон: <code>{phone_number}</code>
🏦 Банк: <b>{bank_name}</b>
🆔 Заявка: #{withdrawal_id}

⏰ {body_data.get('timestamp', 'Сейчас')}
"""
    
    try:
        telegram_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
        requests.post(telegram_url, json={
            'chat_id': admin_chat_id,
            'text': message,
            'parse_mode': 'HTML'
        })
    except Exception as e:
        pass
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'withdrawalId': withdrawal_id,
            'message': 'Заявка принята'
        }),
        'isBase64Encoded': False
    }
