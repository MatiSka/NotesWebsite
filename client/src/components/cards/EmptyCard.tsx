type props = {
    message:    string
}

export default function EmptyCard( {message}: props ) {
    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <p className="w-1/2 text-xl font-mdeium text-slate-700 text-center leading-7 mt-5">
                {message}
            </p>
        </div>
    )
}