import Image from "next/image";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
// import '@/styles/globals.css'; 
export default function Home() {
  return (
    <div className="container">
  <div className="row">
    <div className="col-12 col-md-6">
    <div className="bg-[#2894FF] grid grid-rows-[20px_1fr_20px]  min-h-screen p-4 pb-20 gap-12 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#00BB00] to-[#0066CC] shadow-lg p-4 z-50">
  <ul className="menu flex gap-4 text-xl">
    <li><a href="#">網站介紹</a></li>
    <li><a href="/">回首頁</a></li>
    <li><a href="#">通報狀況</a></li>
    <li><a href="#">常見問題</a></li>
    <li><a href="#">註冊</a></li>
  </ul>
</div>
      <main className="flex flex-col gap-[32px] row-start-2 ">
        <div className="flex items-center gap-4">
      <Image
      src="/logo.svg"
      alt="logo"
      className="h-25 w-25"
      width={50}   
      height={50} 
     />
      <h1 className="text-5xl font-bold py-1">淹水預測及通報系統
      <p className="text-base py-1 " >
        FLOODING WATER AND FORECAST REPORTING SYSTEM
      </p>
      </h1>
      </div>
      <div className="text-center bg-[#ECF5FF] text-black gap-8 flex flex-row justify-center items-cente ">
  <Link href="/form" className="text-2xl hover:underline hover:underline-offset-4">
    水情資訊
  </Link>
  <Link href="/form" className="text-2xl hover:underline hover:underline-offset-4">
    天氣狀況
  </Link>
  <Link href="/form" className="text-2xl hover:underline hover:underline-offset-4">
    淹水預警
  </Link>
  <Link href="/form" className="text-2xl hover:underline hover:underline-offset-4">
    訊息通知
  </Link>
  <Link href="/form" className="text-2xl hover:underline hover:underline-offset-4">
    地圖與路徑
  </Link>
</div>
<div className="flex flex-row ">
  <div className="fixed top-[55%] left-[6%] h-full bg-base-200 p-4">
    <ul className="menu bg-base-200 rounded-box text-left space-y-2" >
          <li>
        <a href="/sun"className="tooltip tooltip-right" data-tip="Details">
          <Image
            src="/sun.svg"
            alt="sun"
            className="h-10 w-10"
            width={50}   
            height={50} 
          />
        </a>
      </li>
        <li>
        <a href="/rain"className="tooltip tooltip-right" data-tip="Details">
          <Image
            src="/rain.svg"
            alt="rain"
            className="h-10 w-10"
            width={50}   
            height={50} 
          />
        </a>
      </li>
      <li>
        <a href="text"className="tooltip tooltip-right" data-tip="Details">
          <Image
            src="/text.svg"
            alt="text"
            className="h-10 w-10"
            width={20}   
            height={20} 
          />
        </a>
      </li>
      <li>
        <a href="warn"className="tooltip tooltip-right" data-tip="Details">
          <Image
            src="/warn.svg"
            alt="warn"
            className="h-10 w-10"
            width={20}   
            height={20} 
          />
        </a>
      </li>
      <li>
        <a href="location" className="tooltip tooltip-right" data-tip="Details">
          <Image
            src="/location.svg"
            alt="location"
            className="h-10 w-10"
            width={20}   
            height={20} 
          />
        </a>
      </li>
 
</ul>
</div>
<div className="flex flex-1 justify-center items-center min-h-[300px]">
    <Image
      src="/wave.jpg"
      alt="wave"
      className="w-[900px] h-[600px] object-cover"
      width={150}
      height={150}
      />
      </div>
</div>
<div className="absolute top-[100%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#005AB5] text-center   p-13 rounded-lg">
    <p className="text-5xl font-bold ">2025年</p>
    <p className="text-7xl font-bold">水文資訊</p>
    <p className="text-4xl font-bold">為您統整</p>
  </div> 
      </main>
      <footer >
       
      </footer>
    </div>
    </div>
    </div>
    </div>
  );
}