import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get all withdrawal requests for admin panel
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict with withdrawals list
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    if method == 'GET':
        query_params = event.get('queryStringParameters', {}) or {}
        status_filter = query_params.get('status', 'all')
        
        if status_filter == 'all':
            cur.execute("""
                SELECT id, phone_number, bank_name, amount, status, 
                       created_at, processed_at
                FROM withdrawals
                ORDER BY created_at DESC
            """)
        else:
            cur.execute("""
                SELECT id, phone_number, bank_name, amount, status, 
                       created_at, processed_at
                FROM withdrawals
                WHERE status = %s
                ORDER BY created_at DESC
            """, (status_filter,))
        
        rows = cur.fetchall()
        withdrawals = []
        
        for row in rows:
            withdrawals.append({
                'id': row[0],
                'phoneNumber': row[1],
                'bankName': row[2],
                'amount': row[3],
                'status': row[4],
                'createdAt': row[5].isoformat() if row[5] else None,
                'processedAt': row[6].isoformat() if row[6] else None
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'withdrawals': withdrawals}),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        withdrawal_id = body_data.get('id')
        new_status = body_data.get('status')
        
        if not withdrawal_id or not new_status:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing id or status'}),
                'isBase64Encoded': False
            }
        
        cur.execute("""
            UPDATE withdrawals 
            SET status = %s, processed_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (new_status, withdrawal_id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'Status updated'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
