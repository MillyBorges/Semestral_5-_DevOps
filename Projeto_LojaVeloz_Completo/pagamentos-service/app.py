from flask import Flask, request, jsonify
import time

app = Flask(__name__)

@app.route('/pagamentos', methods=['POST'])
def processar_pagamento():
    dados = request.get_json()
    pedido_id = dados.get('pedido_id')
    valor = dados.get('valor')
    
    # Simulação de processamento
    time.sleep(1)
    
    return jsonify({
        "status": "sucesso",
        "transacao_id": f"TXN-{int(time.time())}",
        "pedido_id": pedido_id,
        "valor": valor
    }), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "Pagamentos Service is running"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
