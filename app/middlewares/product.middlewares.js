'use strict'

function checkBulkEditReq(req, res, next) {
    if (!Array.isArray(req.body.ids) || !req.body.ids?.length) {
        return res.status(200).json({ success: false, message: 'The list of ids is not correct' })
    }
    if (!req.body.fields) {
        return res.status(200).json({ success: false, message: 'You did not set fields.' })
    }
    let propHasErr = null
    for (const prop in req.body.fields) {
        if (!req.body.fields.hasOwnProperty(prop)) {
            propHasErr = prop
            break
        }
        if (prop === 'onlineSell') {
            if (typeof req.body.fields[prop] !== 'boolean') {
                propHasErr = prop
                break
            }
        } else {
            if (typeof req.body.fields[prop] !== 'number') {
                propHasErr = prop
                break
            }
        }
    }
    if (propHasErr) {
        return res.status(200).json({ success: false, message: `The ${propHasErr} field is not correct.` })
    }
    next()
}
function checkBulkRemoveReq(req, res, next) {
    if (!Array.isArray(req.body.ids) || !req.body.ids?.length) {
        return res.status(200).json({ success: false, message: 'The list of ids is not correct' })
    }
    next()
}

module.exports = {
    checkBulkEditReq,
    checkBulkRemoveReq
}