import React from 'react'
import b1 from "../assets/b1.png"
import b2 from "../assets/b2.png"
import b3 from "../assets/b3.png"

const HomePage = () => {
    return (
        <>
            <div className="banner my-3" id="banner">
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">

                        <div className="carousel-item active">
                            <img src={b1} className="d-block w-100" alt="banner" />
                        </div>

                        <div className="carousel-item">
                            <img src={b2} className="d-block w-100" alt="banner" />
                        </div>

                        <div className="carousel-item">
                            <img src={b3} className="d-block w-100" alt="banner" />
                        </div>

                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>

                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>

                </div>
            </div>



        </>

    )
}

export default HomePage