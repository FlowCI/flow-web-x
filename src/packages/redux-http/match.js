export default function isMatch (config, action) {
  return action.url && (!config.type || config.type === action.type)
}
