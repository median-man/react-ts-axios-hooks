import * as React from 'react';
import {
  Beer,
  Coffee,
  useLazyBeer,
  useLazyCoffee,
  useRandomBeer,
  useRandomCoffee,
} from './api';
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
        {beer.data && <Beer {...beer.data} />}
      </section>
      <section>
        <h2>Coffee</h2>
        {coffee.isPending && <p>Loading...</p>}
        {coffee.data && <Coffee {...coffee.data} />}
      </section>
      <YouDecideSection />
    </div>
  );
}

function YouDecideSection() {
  const [fetchBeer, beerState] = useLazyBeer();
  const [fetchCoffee, coffeeState] = useLazyCoffee();
  const [bevType, setBevType] = React.useState<'coffee' | 'beer' | null>(null);
  const disableButtons = beerState.isPending || coffeeState.isPending;

  return (
    <section>
      <h2>You Decide</h2>
      <div>
        <button
          onClick={() => {
            setBevType('coffee');
            fetchCoffee();
          }}
          disabled={disableButtons}
        >
          Coffee
        </button>
        <button
          onClick={() => {
            setBevType('beer');
            fetchBeer();
          }}
          disabled={disableButtons}
        >
          Beer
        </button>
      </div>
      {bevType === 'coffee' && coffeeState.isPending && 'Loading coffee...'}
      {bevType === 'coffee' && coffeeState.data && (
        <Coffee {...coffeeState.data} />
      )}
      {bevType === 'beer' && beerState.isPending && 'Loading beer...'}
      {bevType === 'beer' && beerState.data && <Beer {...beerState.data} />}
    </section>
  );
}

function Coffee({ blend_name, origin, variety, notes }: Coffee) {
  return (
    <div>
      <p>{blend_name}</p>
      <p>Origin: {origin}</p>
      <p>Variety: {variety}</p>
      <p>Notes: {notes}</p>
    </div>
  );
}

function Beer({ brand, name, style, alcohol }: Beer) {
  return (
    <div>
      <p>
        {brand} {name}
      </p>
      <p>Style: {style}</p>
      <p>Alcohol: {alcohol}</p>
    </div>
  );
}
