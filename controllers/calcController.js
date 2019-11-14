//Shanti R Rao and Potluri M Rao, "Sample Size Calculator", 
//Raosoft Inc., 2009, http://www.raosoft.com/samplesize.html

function ProbCriticalNormal(P)
{
//      input p is confidence level convert it to
//      cumulative probability before computing critical

	var   Y, Pr,	Real1, Real2, HOLD;
	var  I;
	var PN = [0,    // ARRAY[1..5] OF REAL
			-0.322232431088  ,
			 -1.0             ,
			 -0.342242088547  ,
			 -0.0204231210245 ,
			 -0.453642210148E-4 ];

	var QN = [0,   //  ARRAY[1..5] OF REAL
			0.0993484626060 ,
			 0.588581570495  ,
			 0.531103462366  ,
			 0.103537752850  ,
			 0.38560700634E-2 ];

	 Pr = 0.5 - P/2; // one side significance


  if ( Pr <=1.0E-8) HOLD = 6;
	else {
			if (Pr == 0.5) HOLD = 0;
			else{
					Y = Math.sqrt ( Math.log( 1.0 / (Pr * Pr) ) );
					Real1 = PN[5];  Real2 = QN[5];

					for ( I=4; I >= 1; I--)
					{
					  Real1 = Real1 * Y + PN[I];
					  Real2 = Real2 * Y + QN[I];
					}

					HOLD = Y + Real1/Real2;
			} // end of else pr = 0.5
		} // end of else Pr <= 1.0E-8

  return HOLD;
}  // end of CriticalNormal

exports.SampleSize = function SampleSize(margin,  confidence,  response,  population)
{
     pcn = ProbCriticalNormal(confidence / 100.0);
     d1 = pcn * pcn * response * (100.0 - response);
     d2 = (population - 1.0) * (margin * margin) + d1;
    if (d2 > 0.0)
     return Math.ceil(population * d1 / d2);
    return 0.0;
}