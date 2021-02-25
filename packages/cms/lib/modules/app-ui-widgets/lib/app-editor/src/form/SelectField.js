import React, { Component } from 'react';

const Select = ({update, options, activeValue}) => {
    return (
        <select
            onChange={(event) => {
                update(event.currentTarget.value)
            }}
            defaultValue={activeValue}
        >
            {options.map((option, i) => {
                return <option key={i} value={option.value} >{option.label}</option>
            })}
        </select>
    );
}

export default Select;
