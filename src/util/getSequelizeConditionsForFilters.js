const Sequelize = require('sequelize');

module.exports = (filterKeys, filtersInclude, sequelize, filtersExclude) => {
    let conditions = {
        [Sequelize.Op.and]: []
    };
    
    filterKeys.forEach((filter) => {
        //first add include filters
        if (filtersInclude && filtersInclude[filter.key]) {
            let filterValue = filtersInclude[filter.key];
            
            if (!filter.extraData) {
                return conditions[Sequelize.Op.and].push({
                    [filter.key]: filterValue
                });
            }
            
            filterValue = Array.isArray(filterValue) ? filterValue : [filterValue];
            
            const escapedKey = sequelize.escape(`$.${filter.key}`);
            filterValue.forEach((value) => {
                const escapedValue = sequelize.escape(value);
                conditions[Sequelize.Op.and].push({
                    [Sequelize.Op.and]: sequelize.literal(`extraData->${escapedKey}=${escapedValue}`)
                });
            });
            
        }
        
        //add exclude filters
        if (filtersExclude && filtersExclude[filter.key]) {
            let excludeFilterValue = filtersExclude[filter.key];
            
            if (filter.extraData) {
                excludeFilterValue = Array.isArray(excludeFilterValue) ? excludeFilterValue : [excludeFilterValue];
                
                //filter out multiple conditions
                const escapedKey = sequelize.escape(`$.${filter.key}`);
                excludeFilterValue.forEach((value) => {
                    const escapedValue = sequelize.escape(value);
                    conditions[Sequelize.Op.and].push({
                        [Sequelize.Op.and]: sequelize.literal(`extraData->${escapedKey}!=${escapedValue}`)
                    });
                })
            }
        }
    });
    
    return {
        where: sequelize.and(conditions)
    }
}
