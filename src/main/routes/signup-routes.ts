import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (_request, response) => response.json({ ok: 'okay' }))
}
