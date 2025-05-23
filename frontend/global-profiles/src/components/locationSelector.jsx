import  { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";

export default function LocationSelector({
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
}) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry?.isoCode) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      setSelectedState(null);
      setSelectedCity("");
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry?.isoCode && selectedState?.isoCode) {
      setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
      setSelectedCity("");
    } else {
      setCities([]);
    }
  }, [selectedState]);

  return (
    <div className="flex flex-col md:flex-row gap-2">
    
      <select
        value={selectedCountry?.name || ""}
        onChange={(e) => {
          const selected = countries.find(c => c.name === e.target.value);
          setSelectedCountry(selected || null);
        }}
        className="border border-gray-300 rounded px-3 py-2 text-sm"
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>

     
      <select
        value={selectedState?.name || ""}
        onChange={(e) => {
          const selected = states.find(s => s.name === e.target.value);
          setSelectedState(selected || null);
        }}
        className="border border-gray-300 rounded px-3 py-2 text-sm"
        disabled={!selectedCountry}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 text-sm"
        disabled={!selectedState}
      >
        <option value="">Select City</option>
        {cities.map((city, idx) => (
          <option key={idx} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}
