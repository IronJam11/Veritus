export default function SimplePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Hello World!</h1>
      <p>If you can see this, the deployment is working!</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  );
}
