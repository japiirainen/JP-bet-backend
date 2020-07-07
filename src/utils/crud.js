export const getOne = (model) => async (req, res, next) => {
    try {
        const doc = await model.findOne({ _id: req.params.id }).lean().exec()

        if (!doc) return next()

        res.status(200).json({ data: doc })
    } catch (e) {
        return next(e)
    }
}

export const getMany = (model) => async (req, res, next) => {
    try {
        const docs = await model.find().lean().exec()

        if (!docs) return next()

        res.status(200).json({ data: docs })
    } catch (e) {
        return next(e)
    }
}

export const createOne = (model) => async (req, res, next) => {
    try {
        const doc = await model.create({ ...req.body })
        res.status(200).json({ data: doc })
    } catch (e) {
        return next(e)
    }
}

export const updateOne = (model) => async (req, res, next) => {
    try {
        const updatedDoc = await model
            .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .lean()
            .exec()
        if (!updatedDoc) return res.status(400).next()

        res.status(200).json({
            data: req.body,
            message: 'successful PUT request.',
        })
    } catch (e) {
        return next(e)
    }
}

export const removeOne = (model) => async (req, res, next) => {
    try {
        const removed = await model
            .findOneAndRemove({ _id: req.params.id })
            .lean()
            .exec()

        if (!removed) return next()

        res.status(200).json({ data: removed })
    } catch (e) {
        return next(e)
    }
}

export const crudControllers = (model) => ({
    createOne: createOne(model),
    getOne: getOne(model),
    getMany: getMany(model),
    updateOne: updateOne(model),
    removeOne: removeOne(model),
})
