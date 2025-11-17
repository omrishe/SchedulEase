import { useState } from "react";
export function ServiceForm({ formValues, handleInputChange, className }) {
  return (
    <div className={className}>
      <label htmlFor="name">service name </label>
      <input
        name="name"
        onChange={(e) => handleInputChange(e, formValues.formId)}
        value={formValues["name"]}
      />
      <label htmlFor="servicePrice">service price </label>
      <input
        name="price"
        onChange={(e) => handleInputChange(e, formValues.formId)}
        value={formValues["price"]}
      />
      <label htmlFor="serviceNote">service note </label>
      <input
        name="serviceNote"
        onChange={(e) => handleInputChange(e, formValues.formId)}
        value={formValues["serviceNote"]}
      />
    </div>
  );
}
