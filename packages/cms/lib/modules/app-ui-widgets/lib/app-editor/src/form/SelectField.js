import React, { Component } from 'react';

const Select = ({options, activeValue}) => {
    return (
        <select
            onChange={(event) => {
                this.props.update(event.currentTarget.value)
            }}
        >
            {options.map((option) => {
                return <option value={option.value} selected={option.value === activeValue}>{option.label}</option>
            })}
        </select>
    );
}

export default Select;
