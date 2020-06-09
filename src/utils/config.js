require('dotenv').config()

const config = {
	options: {
		port: process.env.PORT,
		dbUrl: process.env.DBURL,
		welcomemsg: process.env.WELCOMEMESSAGE
	},
	secrets: {
		jwt: process.env.JWT_SECRET,
		jwtExp: '100d'
	}
}
export default config
