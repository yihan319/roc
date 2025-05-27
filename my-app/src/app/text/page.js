import Image from "next/image";
export default function FormPage(){
    return(
      <div className="bg-[#2894FF] grid grid-rows-[20px_1fr_20px]  min-h-screen p-4 pb-20 gap-12 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#00BB00] to-[#0066CC] shadow-lg p-4 z-50">
   <ul className="menu flex gap-4 text-xl">
     <li><a href="#">網站介紹</a></li>
     <li><a href="#">回首頁</a></li>
     <li><a href="#">通報狀況</a></li>
     <li><a href="#">常見問題</a></li>
     <li><a href="#">註冊</a></li>
   </ul>
 </div>
 <div>
  <h1>選取區域</h1>
 </div>
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
 </div>
    );
}