const Sequelize = require('sequelize');

module.exports = (filterKeys, filtersInclude, sequelize, filtersExclude) => {
    let conditions = {
        [Sequelize.Op.and]: []
    };
    
    filterKeys.forEach((filter, i) => {
        //first add include filters
        if (filtersInclude) {
            let filterValue = filtersInclude[filter.key];
            
            if (filtersInclude[filter.key]) {
                if (filter.extraData) {
                    filterValue = Array.isArray(filterValue) ? filterValue : [filterValue];
                    
                    const escapedKey = sequelize.escape(`$.${filter.key}`);
                    filterValue.forEach((value, key) => {
                        const escapedValue = sequelize.escape(value);
                        conditions[Sequelize.Op.and].push({
                            [Sequelize.Op.and]: sequelize.literal(`extraData->${escapedKey}=${escapedValue}`)
                        });
                    });
                    
                } else {
                    conditions[Sequelize.Op.and].push({
                        [filter.key]: filterValue
                    });
                }
            }
        }
        
        //add exclude filters
        if (filtersExclude) {
            let excludeFilterValue = filtersExclude[filter.key];
            
            if (excludeFilterValue) {
                if (filter.extraData) {
                    excludeFilterValue = Array.isArray(excludeFilterValue) ? excludeFilterValue : [excludeFilterValue];
                    
                    //filter out multiple conditions
                    const escapedKey = sequelize.escape(`$.${filter.key}`);
                    excludeFilterValue.forEach((value, key) => {
                        const escapedValue = sequelize.escape(value);
                        conditions[Sequelize.Op.and].push({
                            [Sequelize.Op.and]: sequelize.literal(`extraData->${escapedKey}!=${escapedValue}`)
                        });
                    })
                }
            }
        }
    });
    
    return {
        where: sequelize.and(conditions)
    }
}
