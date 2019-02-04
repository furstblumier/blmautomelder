
//Party buff things
  var battleVoiceAvg = (20 / 180) * 0.15;
  var battleLitanyAvg = (20 / 180) * 0.15;
  var chainStratAvg = (15 / 120) * 0.15;
  var brdCritSong = 0.02;

// Traits and eno
  var magicAndMend = 1.3
  var enochian = 1.1
  
// Pulled from Orinx's Gear Comparison Sheet with slight modifications
function Damage(Potency, WD, JobMod, MainStat,Det, Crit, DH,SS,TEN, hasBrd, hasDrg, hasSch) {
  
  MainStat=Math.floor(MainStat*1.03);
  var Damage=Math.floor(Potency*(WD+Math.floor(292*JobMod/1000))*(100+Math.floor((MainStat-292)*1000/2336))/100);
  Damage=Math.floor(Damage*(1000+Math.floor(130*(Det-292)/2170))/1000);
  Damage=Math.floor(Damage*(1000+Math.floor(100*(TEN-364)/2170))/1000);
  Damage=Math.floor(Damage*(1000+Math.floor(130*(SS-364)/2170))/1000/100);
  Damage=Math.floor(Damage*magicAndMend)
  Damage=Math.floor(Damage*enochian)
  var CritDamage=Math.floor(Damage*(1000 * CalcCritDamage(Crit))/1000);
  var DHDamage=Math.floor(Damage*1250/1000);
  var CritDHDamage=Math.floor(CritDamage*1250/1000);
  var CritRate=CalcCritRate(Crit) + (hasBrd ? brdCritSong : 0) + (hasDrg ? battleLitanyAvg : 0) + (hasSch ? chainStratAvg : 0);
  var DHRate=CalcDHRate(DH) + (hasBrd ? battleVoiceAvg : 0);
  var CritDHRate=CritRate*DHRate;
  var NormalRate=1-CritRate-DHRate+CritDHRate;
  
  return Damage * NormalRate + CritDamage * (CritRate-CritDHRate) + DHDamage * (DHRate-CritDHRate) + CritDHDamage * CritDHRate;                                                                                                                               
}

function CalcCritRate(Crit)
{
  return Math.floor(200*(Crit-364)/2170+50)/1000;
}

function CalcCritDamage(Crit)
{
  return (1000+Math.floor(200*(Crit-364)/2170+400))/1000;
}

function CalcDHRate(DH)
{
  return Math.floor(550*(DH-364)/2170)/1000;
}

function CalcDetDamage(Det)
{
  return (1000+Math.floor(130*(Det-292)/2170))/1000;
}

function CalcDamage(Potency, Multiplier, CritDamageMult, CritRate, DHRate) {
  var Damage = Potency * Multiplier;
  var DHDamage = 1.25 * Damage;
  var CritDamage = CritDamageMult * Damage;
  var CritDHDamage = CritDamageMult * 1.25 * Damage;
  var CritDHRate = CritRate * DHRate;
  var NormalRate=1-CritRate-DHRate+CritDHRate;
  
  return Damage * NormalRate + CritDamage * (CritRate-CritDHRate) + DHDamage * (DHRate-CritDHRate) + CritDHDamage * CritDHRate;
}

function GcdCalc(gcd, sps, llFlag) {
  var time = Math.floor(Math.floor(100 * (llFlag ? 85 : 100)  * (Math.floor(gcd * (1000 - Math.floor(130 * (sps-364) / 2170))/1000) / 1000)) / 100)/100
  return time
}