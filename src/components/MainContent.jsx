const MainContent = () => {
    return (
        <main className="pt-20">
            <section className="min-h-[80vh] flex flex-col justify-center items-center text-center p-8 bg-cover bg-center bg-no-repeat"
                     style={{
                         backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)), url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
                     }}>
                <h1 className="text-4xl md:text-6xl font-bold text-chartreuse mb-4">Experience Luxury Transportation</h1>
                <p className="text-xl md:text-2xl mb-8">Travel in style with our premium SUV fleet</p>
                <button className="bg-blue-iris text-white px-8 py-4 text-lg rounded-lg hover:bg-chartreuse hover:text-custom-black transition-colors">
                    Book Now
                </button>
            </section>
        </main>
    );
};

export default MainContent;