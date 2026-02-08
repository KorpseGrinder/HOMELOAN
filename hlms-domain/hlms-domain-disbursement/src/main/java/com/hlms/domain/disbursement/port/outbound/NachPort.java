package com.hlms.domain.disbursement.port.outbound;
import com.hlms.domain.disbursement.entity.LoanNachMandate;
public interface NachPort { String createMandate(LoanNachMandate mandate); boolean cancelMandate(String umrn); }
