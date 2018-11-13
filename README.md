# Guía

1. Primero abre ganache.

2. Abre una terminal en la carpeta del ejemplo que quieras probar.

3. Instala las dependencias

    `$ npm install`

4. Despliega el contrato mediante truffle

    `$ truffle migrate --network ganache --reset`

5. Inicia el proyecto angular

    `$ ng serve --open`

## Notas:

* Asegurate de tener instalado nodejs, truffle, ganache y angular+.
* Comprueba que metamask lo tienes en la red de ganache y con alguna cuenta cargada.
* Si tienes problemas con el nonce al hacer transferencias, cambia de cuenta, cambia de red y vuelve Ganache y por último, cambia el network id en la configuración de Ganache.