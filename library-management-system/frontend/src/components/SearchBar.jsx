export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-wrap">
      <i className="bi bi-search" />
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
