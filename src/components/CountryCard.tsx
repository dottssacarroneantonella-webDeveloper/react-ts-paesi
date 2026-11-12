import { REGION_LABELS, type Country } from '../types/country';

interface CountryCardProps {
  country: Country;
}

/** Formattatore numerico italiano (1.234.567), creato una sola volta e riusato. */
const numberFormatter = new Intl.NumberFormat('it-IT');

/** Componente "di presentazione": riceve i dati via props e li mostra, senza stato proprio. */
export function CountryCard({ country }: CountryCardProps) {
  const capitals = country.capitals.length > 0 ? country.capitals.join(', ') : 'Nessuna capitale';

  return (
    <li className="card">
      <img
        className="card__flag"
        src={country.flagUrl}
        alt={country.flagAlt}
        loading="lazy"
        width={320}
        height={200}
      />
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
