const features = [
  {
    id: 'global',
    icon: 'icon-global',
    title: "World's best luxury homes",
    text: 'Tenetur distinctio necessitatibus pariatur voluptatibus. Quidem consequatur harum volupta!',
  },
  {
    id: 'trophy',
    icon: 'icon-trophy',
    title: 'Only the best properties',
    text: 'Voluptatum mollitia quae. Vero ipsum sapiente molestias accusamus rerum sed a eligendi aut quia.',
  },
  {
    id: 'map-pin',
    icon: 'icon-map-pin',
    title: 'All homes in top locations',
    text: 'Tenetur distinctio necessitatibus pariatur voluptatibus quidem consequatur harum.',
  },
  {
    id: 'key',
    icon: 'icon-key',
    title: 'New home in one week',
    text: 'Vero ipsum sapiente molestias accusamus rerum. Lorem, ipsum dolor sit amet consectetur.',
  },
  {
    id: 'presentation',
    icon: 'icon-presentation',
    title: 'Top 1% realtors',
    text: 'Quidem consequatur harum, voluptatum mollitia quae. Tenetur distinctio necessitatibus.',
  },
  {
    id: 'lock',
    icon: 'icon-lock',
    title: 'Secure payments on nexter',
    text: 'Pariatur voluptatibus quidem consequatur harum, voluptatum mollitia quae.',
  },
];

export default function Features() {
  return (
    <section className="features">
      {features.map((feature, i) => (
        <div key={feature.id} className={`feature animate fade-up delay-${i + 1}`}>
          <svg className="feature__icon">
            <use href={`/img/sprite.svg#${feature.icon}`} />
          </svg>
          <h4 className="heading-4 heading-4--dark">{feature.title}</h4>
          <p className="feature__text">{feature.text}</p>
        </div>
      ))}
    </section>
  );
}
