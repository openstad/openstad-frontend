import React, { Component } from 'react';

const Select = ({update, options, activeValue}) => {
    return (
        <select
            onChange={(event) => {
                update(event.currentTarget.value)
            }}
        >
            {options.map((option) => {
                return <option value={option.value} selected={option.value === activeValue}>{option.label}</option>
            })}
        </select>
    );
}

export default Select;
