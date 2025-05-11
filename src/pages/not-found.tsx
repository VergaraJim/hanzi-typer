function NotFoundPage() {
  return (
    <div className="w-full h-full flex p-4">
      <div className="p-4 m-auto bg-neutral-600 w-full text-center">
        <h1 className="text-6xl font-bold text-red-300 mb-5">404</h1>
        <p className="text-xl font-medium">
          The page you're looking for could not be found
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
