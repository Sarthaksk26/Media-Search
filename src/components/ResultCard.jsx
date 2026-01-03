

const ResultCard = ({item}) => {
  return (
    <div className="w-[17vw] h-80 text-black">
        <div className="h-full:">
            {item.type == 'photo' ? <img className="h-full w-full object-cover object-center" src={item.src} alt="" />:''}
        {item.type == 'video' ? <video className="h-full w-full object-cover object-center" autoPlay loop muted src={item.src}></video> : ''}
        {item.type == 'gif' ?  <img className="h-full w-full object-cover object-center" src={item.src} alt="" /> : ''}
        </div>
       <h1 className="w-full p-4 text-white">
         <h2>{item.title}</h2>
       </h1>
    </div>
  )
}

export default ResultCard