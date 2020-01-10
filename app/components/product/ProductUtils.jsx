import React from 'react';
import ProductEdit from "./ProductEdit";
import {Utils} from "../../common";

let ProductUtils = (() => {
    let currentPageKey = 'key-product-pageno';
    let setCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentPageKey, pageno);
    };

    let getCurrentPage = () => {
        return Utils._getCurrentPage(currentPageKey);
    };

    let edit = (product, loadData) => {
        Utils.common.renderReactDOM(<ProductEdit product={product} loadData={loadData}/>);
    };

    return {
        edit, setCurrentPage, getCurrentPage,
    }

})();

export default ProductUtils;