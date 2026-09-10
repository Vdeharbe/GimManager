const test = require('node:test');
const assert = require('node:assert/strict');

const { verificarRol } = require('../middleware/auth.middleware');

const makeReq = (rol) => ({ usuario: { rol } });
const makeRes = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  }
});

test('admin puede acceder a escritura de socios', () => {
  const req = makeReq('admin');
  const res = makeRes();
  let nextCalled = false;

  const next = () => {
    nextCalled = true;
  };

  verificarRol(['admin'])(req, res, next);

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});

test('instructor solo puede leer socios y no escribir', () => {
  const req = makeReq('instructor');
  const res = makeRes();
  let nextCalled = false;

  const next = () => {
    nextCalled = true;
  };

  verificarRol(['admin'])(req, res, next);

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.mensaje, 'No tienes permisos para esta acción');
});
