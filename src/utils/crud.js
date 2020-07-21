const getOne = (model) => async (req, res, next) => {
    try {
        const doc = await model.findOne({ _id: req.params.id }).lean().exec()

        if (!doc) return next()

        res.status(200).json({ data: doc })
    } catch (e) {
        return next(e)
    }
}

const getMany = (model) => async (req, res, next) => {
    try {
        const docs = await model.find().lean().exec()

        if (!docs) return next()

        res.status(200).json({ data: docs })
    } catch (e) {
        return next(e)
    }
}

const createOne = (model) => async (req, res, next) => {
    try {
        const doc = await model.create({ ...req.body })
        res.status(200).json({ data: doc })
    } catch (e) {
        return next(e)
    }
}

const updateOne = (model) => async (req, res, next) => {
    try {
        const doc = await model.findById(req.params.id)
        if (doc) {
            await model.update({ _id: req.params.id }, req.body)
            return res.status(200).json({
                message: 'success',
                data: await model.findById(req.params.id),
            })
        }

        // const updatedDoc = await model
        //     .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        //     .lean()
        //     .exec()
        // if (!updatedDoc) return res.status(400).next()

        res.status(200).json({
            message: 'success',
            data: doc,
        })
    } catch (e) {
        return next(e)
    }
}

const removeOne = (model) => async (req, res, next) => {
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

module.exports = (model) => ({
    createOne: createOne(model),
    getOne: getOne(model),
    getMany: getMany(model),
    updateOne: updateOne(model),
    removeOne: removeOne(model),
})
