## 🎯 Objetivo principal

Evitar fraudes o confusiones en entornos donde los vendedores reciben pagos mediante transferencias, permitiendo validar **que el dinero efectivamente llegó** a la cuenta de mercado pago del destinatario.

# validador-backend

Backend diseñado para **proteger a los usuarios de transferencias falsas recibidas por Mercado Pago**.

Permite a cada usuario conectar su cuenta a través de OAuth y recibir notificaciones automáticas cada vez que se acredita una transferencia real (por CBU o alias). La validación se realiza directamente contra la API oficial de Mercado Pago y los usuarios reciben un aviso en tiempo real con el monto acreditado, mediante un mensaje por voz en su navegador.

---


## 🔧 Tecnologías utilizadas

- Java 21
- Spring Boot 3.5.3
- Spring Security (JWT)
- OAuth2 Client
- WebSocket
- Spring Data JPA
- Mercado Pago API
- MySQL

---

## 🚀 ¿Qué hace el sistema?

- Permite que cada usuario vincule su cuenta de Mercado Pago
- Verifica en tiempo real si una transferencia fue realmente acreditada
- Envía notificaciones instantaneas poor WebSocket al usuario correcto con el monto recibido
- Reproduce el mensaje con voz en el navegador del usuario, y se listan ultimas reflejadas
