import { useState } from "react";
import {
  MAX_SERVICE_NAME_LENGTH,
  MAX_PRICE,
  MAX_SERVICE_NOTE_LENGTH,
} from "../config.js";

export function ServiceForm({formValues,handleInputChange,className}){
    return(
    <div className={className}>
        <label htmlFor="name">service name </label>
        <input name="name" onChange={(e)=>handleInputChange(e,formValues.formId)} value={formValues["name"]} maxLength={MAX_SERVICE_NAME_LENGTH}/>
        <label htmlFor="servicePrice">service price </label>
        <input name="price" type="number" max={MAX_PRICE} onChange={(e)=>handleInputChange(e,formValues.formId)} value={formValues["price"]}/>
        <label htmlFor="serviceNote">service note </label>
        <input name="serviceNote" onChange={(e)=>handleInputChange(e,formValues.formId)} value={formValues["serviceNote"]} maxLength={MAX_SERVICE_NOTE_LENGTH}/>
    </div>
    )
}