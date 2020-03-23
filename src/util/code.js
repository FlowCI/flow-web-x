export default {
  ok: 200,
  fatal: 500,
  error: {
    default: 400,
    auth: 401,
    expired: 4011, // client err code for token expired
    args: 402,
    permission: 403,
    not_found: 404,
    not_available: 405,
    duplicate: 406,
    illegal_status: 421,
    json_or_yml: 430
  }
}
