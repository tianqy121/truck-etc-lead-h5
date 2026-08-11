import { ImageResponse } from "next/og";

export const alt = "企业货车ETC批量办理咨询";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width:"100%", height:"100%", display:"flex", position:"relative", overflow:"hidden", background:"linear-gradient(120deg, #3c0710 0%, #8d1727 58%, #d56b46 100%)" }}><div style={{ position:"absolute", top:70, left:82, width:120, height:48, display:"flex", justifyContent:"center", alignItems:"center", borderRadius:8, background:"#f4c574", color:"#6d0e19", fontSize:25, fontWeight:800 }}>ETC</div><div style={{ position:"absolute", bottom:-110, right:-100, width:850, height:330, borderTop:"14px solid #f4c574", borderRadius:"50%", transform:"rotate(-12deg)" }} /><div style={{ position:"absolute", bottom:-35, right:70, width:390, height:170, display:"flex", borderRadius:22, background:"#f3d6bb", border:"12px solid #4a111b" }}><div style={{ width:100, height:140, marginTop:18, marginLeft:18, borderRadius:12, background:"#e07142" }} /><div style={{ width:220, height:125, marginTop:18, marginLeft:10, borderRadius:7, background:"#fff4e7" }} /></div></div>, size);
}
