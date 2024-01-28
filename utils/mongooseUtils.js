// for creating
exports.For_Create=async(Model,data)=>{
    let result = await Model.create(
    data
    )
    return result
}

// for find
exports.For_Find = async (Model, query, options = {}) => {
    let { sort, limit, skip, populate,select } = options;
    let queryBuilder = Model.find(query);

    // Sorting
    if (sort) {
        queryBuilder = queryBuilder.sort(sort);
    }

    // Limiting
    if (limit) {
        queryBuilder = queryBuilder.limit(limit);
    }

    // Skipping
    if (skip) {
        queryBuilder = queryBuilder.skip(skip);
    }

    // Populating
    if (populate) {
        queryBuilder = queryBuilder.populate(populate);
    }

    // Select
    if (select) {
        queryBuilder = queryBuilder.select(select);
    }

    let result = await queryBuilder.exec();
    return result;
};

//for find one
exports.For_FindOne = async (Model, query, options = {}) => {
    let {populate,select } = options;
    let queryBuilder = Model.findOne(query);

    // Select
    if (select) {
        queryBuilder = queryBuilder.select(select);
    }

    // Populating
    if (populate) {
        queryBuilder = queryBuilder.populate(populate);
    }

    let result = await queryBuilder.exec();
    return result;
};

//for find by id
exports.For_FindById = async (Model, id, conditions = {}, options = {}) => {
    let { populate, select } = options;
    let queryBuilder = Model.findById(id);

    // Apply conditions using .where()
    if (conditions) {
        queryBuilder = queryBuilder.where(conditions);
    }

    // Select specific fields
    if (select) {
        queryBuilder = queryBuilder.select(select);
    }

    // Populating
    if (populate) {
        queryBuilder = queryBuilder.populate(populate);
    }

    let result = await queryBuilder.exec();
    return result;
};


//for find by and update
exports.For_FindByIdAndUpdate = async (Model, id, updateFields) => {
    let queryBuilder = Model.findByIdAndUpdate(id, updateFields, { new: true }); // Setting { new: true } returns the modified document rather than the original
    let result = await queryBuilder.exec();
    return result;
};

//for find one and update
exports.For_FindOneAndUpdate = async (Model, filter, update) => {
    try {
        let result = await Model.findOneAndUpdate(filter, update,  { new: true }).exec();
        return result;
    } catch (error) {
        throw new Error(`Error updating document: ${error}`);
    }
};

//for find by and delete
exports.For_FindByIdAndDelete = async (Model, id) => {
    let result = await Model.findByIdAndDelete(id).exec();
    return result;
};

