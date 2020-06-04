/* export const getOne = model => async (req, res) {
    try {
        const doc = await model.findOne({  })
    } catch (e) {
        
    }
} */

//export const gotMany

export const createOne = model => async (req, res) => {
	try {
		const doc = await model.create({ ...req.body })
		res.status(200).json({ data: doc })
	} catch (e) {
		console.error(e)
		res.status(400).end()
	}
}

export const crudControllers = model => ({
	createOne: createOne(model)
})
