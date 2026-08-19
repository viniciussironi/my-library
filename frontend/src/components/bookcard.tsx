import { api } from '../config/api';

export default function BookCard({ titulo, autor, capa }: { titulo: string; autor: string; capa: string }) {
    return (
        <div
            className="
              relative cursor-pointer 
              w-[120px] h-[180px] sm:w-[150px] sm:h-[220px] md:w-[180px] md:h-[260px] 
              overflow-hidden rounded-lg 
              shadow-[0_8px_20px_rgba(0,0,0,0.3)] 
              transition-all duration-300 ease-[cubic-bezier(0,0,.5,1)] 
              hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)]
            "
        >
            <img
                src={`${api.defaults.baseURL}${capa}`} 
                alt={titulo}
                className="w-full h-full object-cover"
            />
            <div
                className="
                    absolute top-0 left-0 w-full h-full 
                    bg-[oklch(63.187%_0.18673_147.227_/_0.55)] text-white 
                    flex flex-col items-center justify-center text-center p-2.5 
                    opacity-0 transition-opacity duration-300 ease-in-out 
                    hover:opacity-100
                "
            >
                  <h3 className="truncate">{titulo}</h3>
                  <p className="truncate">{autor}</p>
            </div>
        </div>
    );
}