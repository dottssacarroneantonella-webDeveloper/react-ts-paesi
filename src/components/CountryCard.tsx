import { useState } from 'react';
import { REGION_LABELS, type Country } from '../types/country';

interface CountryCardProps {
  country: Country;
}

/** Formattatore numerico italiano (1.234.567), creato una sola volta e riusato. */
const numberFormatter = new Intl.NumberFormat('it-IT');

/** Componente "di presentazione": riceve i dati via props e li mostra. */
export function CountryCard({ country }: CountryCardProps) {
  // Stato locale: diventa true se l'immagine della bandiera non si carica.
  const [flagFailed, setFlagFailed] = useState(false);
  const capitals = country.capitals.length > 0 ? country.capitals.join(', ') : 'Nessuna capitale';
  const showFlag = country.flagUrl !== '' && !flagFailed;

  return (
    <li className="card">
      {showFlag ? (
        <img
          className="card__flag"
          src={country.flagUrl}
          alt={country.flagAlt}
          loading="lazy"
          width={320}
          height={200}
          onError={() => setFlagFailed(true)}
        />
      ) : (
        // Segnaposto quando l'API non fornisce la bandiera o l'immagine non si carica.
        <div className="card__flag card__flag--missing" role="img" aria-label={`Bandiera di ${country.name} non disponibile`}>
          <span aria-hidden="true">{country.code || country.name.slice(0, 3).toUpperCase()}</span>
        </div>
      )}
      <div className="card__body">
        <h2 className="card__title">{country.name}</h2>
        <dl className="card__details">
          <div>
            <dt>Capitale</dt>
            <dd>{capitals}</dd>
          </div>
          <div>
            <dt>Regione</dt>
            <dd>{REGION_LABELS[country.region]}</dd>
          </div>
          <div>
            <dt>Popolazione</dt>
            <dd>{numberFormatter.format(country.population)}</dd>
          </div>
        </dl>
      </div>
    </li>
  );
}
