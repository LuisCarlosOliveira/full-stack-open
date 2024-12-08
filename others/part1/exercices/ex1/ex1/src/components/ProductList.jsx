import React, { useState } from "react";

const products = [
    { id: 1, nome: 'Produto A', preco: 10.0 },
    { id: 2, nome: 'Produto B', preco: 20.0 },
    { id: 3, nome: 'Produto C', preco: 30.0 },
  ];

function ProductList() {

    return (
        <div>
            <h1> Products List</h1>
            {products.map((product) =>(
                <li key={product.id}>{product.nome} - $ {product.preco}</li>
            ) )}
        </div>

    );
}

export default ProductList;