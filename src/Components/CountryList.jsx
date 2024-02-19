import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { TEInput } from "tw-elements-react";

const COUNTRIES_QUERY = gql`
  query Query {
    countries {
      name
      native
      capital
      emoji
      currency
    }
  }
`;

const colorPalette = [
  "bg-blue-100",
  "bg-green-100",
  "bg-pink-100",
  "bg-yellow-100",
  "bg-rose-100",
  "bg-fuchsia-100",
  "bg-purple-100",
  "bg-violet-100",
  "bg-indigo-100",
  "bg-blue-300",
  "bg-green-300",
  "bg-pink-300",
  "bg-yellow-300",
  "bg-rose-300",
  "bg-fuchsia-300",
  "bg-purple-300",
  "bg-violet-300",
  "bg-indigo-300",
];

function CountryList() {
  const { data } = useQuery(COUNTRIES_QUERY);
  const [filter, setFilter] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [loadedCountryCount, setLoadedCountryCount] = useState(10);
  const [selectedColorIndices, setSelectedColorIndices] = useState({});
  const [randomNumber, setRandomNumber] = useState();
  const [randomColor, setRandomColor] = useState();

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleCountryClick = (country) => {
    let newSelectedCountries = [...selectedCountries];
    let newSelectedColorIndices = { ...selectedColorIndices };

    // Check if the country is already selected
    if (newSelectedCountries.includes(country)) {
      // If selected, remove it from the list and the color index
      newSelectedCountries = newSelectedCountries.filter((c) => c !== country);
      delete newSelectedColorIndices[country.name];
    } else {
      // If not selected, add it to the list and assign a new color index
      newSelectedCountries.push(country);
      const nextColorIndex = getNextColorIndex();
      newSelectedColorIndices[country.name] = nextColorIndex;
    }

    setSelectedCountries(newSelectedCountries);
    setSelectedColorIndices(newSelectedColorIndices);
  };

  const getNextColorIndex = () => {
    // Generate a random color index that is not already used
    const usedIndices = Object.values(selectedColorIndices);
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * colorPalette.length);
    } while (usedIndices.includes(nextIndex));
    return nextIndex;
  };

  const filteredCountries = data
    ? data.countries.filter((country) =>
        country.name.toLowerCase().includes(filter.toLowerCase())
      )
    : [];
  
  //  filtre değiştiğinde, eğer sonuncu öğe arama yapılmasına rağmen aynı ise ona random renk her serferinde atama daha önceden seçilmiş ülkeleri sıfırla renkleri değiştir. eğer hala sonuncu öğe seçiliyse, onun rengini değiştirme
  useEffect(() => {
    setSelectedCountries([]);
    setSelectedColorIndices({});
    setRandomColor();
  }
  , [filter]);

   // Handle loading more countries
  const handleLoadMore = () => {
    setLoadedCountryCount((prevCount) => prevCount + 10);
  };
          
  useEffect(() => {
    // Sadece filteredCountries dizisi güncellendiğinde çalışacak
    if (filteredCountries.length > 0) {
      const lastCountry = filteredCountries[filteredCountries.length - 1];
  
      // Son ülke zaten seçiliyse, seçili ülkeler listesinde ve renk indekslerinde bir değişiklik yapma
      if (!selectedCountries.includes(lastCountry)) {
        let newSelectedCountries = [...selectedCountries];
        let newSelectedColorIndices = { ...selectedColorIndices };
  
        newSelectedCountries.push(lastCountry);
        const nextColorIndex = getNextColorIndex();
        newSelectedColorIndices[lastCountry.name] = nextColorIndex;
  
        setSelectedCountries(newSelectedCountries);
        setSelectedColorIndices(newSelectedColorIndices);
      }
    }
  }, [filteredCountries, selectedCountries]);

  return (
    <div className="p-5">
      <h1 className="text-center">Countries</h1>
      <div className="m-3 justify-center flex">
        <TEInput
          type="text"
          id="exampleFormControlInput1"
          label="Search and group..."
          value={filter}
          onChange={handleFilterChange}
          style={{ width: "350px", height: "40px" }}
          className=""
        />
      </div>
      <div className="m-3 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 dark:bg-neutral-800">
        {filteredCountries
          .slice(0, loadedCountryCount)
          .map((country, index) => {
            const isLastCountry = index === loadedCountryCount - 1;
            const colorIndex = selectedColorIndices[country.name] ?? 0;

            return (
              <div
                key={country.name}
                onClick={() => handleCountryClick(country)}
                className={`p-4 border ${

                  // give a random color to the last country when i click the last country it will change the color goes back to the first color
                  isLastCountry && randomColor
                    ? randomColor + " cursor-pointer"
                    : selectedColorIndices[country.name] !== undefined
                    ? colorPalette[colorIndex] + " cursor-pointer"
                    : "bg-white cursor-pointer"
                    
                }`}
              >
                <div className="rounded-lg bg-white text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                  <div className="border-b-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
                    {country.name}
                  </div>
                  <div className="p-6">
                    <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                      {country.native}
                    </h5>
                    <p className="mb-4 text-base text-neutral-600 dark:text-neutral-200">
                      Capital: {country.capital}
                    </p>
                    <p className="text-base text-neutral-600 dark:text-neutral-200">
                      Flag: {country.emoji}
                    </p>
                  </div>
                  <div className="border-t-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
                    Currency: {country.currency}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {filteredCountries.length > loadedCountryCount && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default CountryList;
