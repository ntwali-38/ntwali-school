function StarRating({ rating = 4 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
