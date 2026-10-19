type WelcomeProps = Readonly<{
  title: string;
  message: string;
}>;

const Welcome = ({ title, message }: WelcomeProps) => (
  <main>
    <h1>{title}</h1>
    <p>{message}</p>
  </main>
);

export default Welcome;
