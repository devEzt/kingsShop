import Commerce from '@chec/commerce.js';

export const commerce = new Commerce(process.env.REACT_APP_CHEC_PUBLIC_KEY, true);
// bom a key poderia ser colocada aqui, mas uma boa pratica é criar um arquivo chamado .env

