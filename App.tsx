import * as React from 'react';
import { useRandomBeer, useRandomCoffee } from './api';
import './style.css';

export default function App() {
  const beer = useRandomBeer();
  const coffee = useRandomCoffee();

  return (
    <div>
      <h1>Random Things</h1>
      <section>
        <h2>Beer</h2>
        {beer.isPending && <p>Loading...</p>}
        {beer.data && (
          <div>
            <p>
              {beer.data.brand} {beer.data.name}
            </p>
            <p>Style: {beer.data.style}</p>
            <p>Alcohol: {beer.data.alcohol}</p>
          </div>
        )}
      </section>
      <section>
        <h2>Coffee</h2>
        {coffee.isPending && <p>Loading...</p>}
        {coffee.data && (
          <div>
            <p>
              {coffee.data.blend_name}
            </p>
            <p>Origin: {coffee.data.origin}</p>
            <p>Variety: {coffee.data.variety}</p>
            <p>Notes: {coffee.data.notes}</p>
          </div>
        )}
      </section>
    </div>
  );
}
