
import React, { Component } from 'react';

const availableLanguages = [
  {
    value: 'de',
    label: 'Deutsch'
  },
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'es',
    label: 'Espanol'
  },
  {
    value: 'fr',
    label: 'Francaise'
  },
  {
    value: 'nl',
    label: 'Nederlands'
  }
];

const LanguageSelect = ({selectedValue}) => {
  return (
    <Select>
      {availableLanguages.map((language) => {
        return <option value={language.value} selected={language.value === selectedValue}>{language.label} </option>
      })}
    </Select>
  );
}

export default LanguageSelect;
