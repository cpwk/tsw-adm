import React from 'react';
import SortEdit from "./SortEdit";
import {Utils} from "../../common";

let SortUtils = (() => {

    let edit = (sort, loadData) => {
        Utils.common.renderReactDOM(<SortEdit sort={sort} loadData={loadData}/>);
    };

    return {
        edit
    }

})();

export default SortUtils;