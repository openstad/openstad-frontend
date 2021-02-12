import React, { Component } from 'react';

const Select = ({options, activeValue}) => {
    return (
        <select>
            {options.map((option) => {
                return <option value={option.value} selected={option.value === activeValue}>{option.label}</option>
            })}
        </select>
    );
}

export default Select;
