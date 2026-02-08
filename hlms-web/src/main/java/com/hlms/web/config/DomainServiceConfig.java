package com.hlms.web.config;

import com.hlms.domain.collection.service.DpdCalculator;
import com.hlms.domain.collection.service.NpaClassifier;
import com.hlms.domain.collection.service.ProvisioningCalculator;
import com.hlms.domain.customer.service.CustomerDomainService;
import com.hlms.domain.disbursement.service.DisbursementDomainService;
import com.hlms.domain.loan.service.LoanDomainService;
import com.hlms.domain.property.service.PropertyDomainService;
import com.hlms.domain.servicing.service.AmortizationScheduleGenerator;
import com.hlms.domain.servicing.service.EmiCalculator;
import com.hlms.domain.servicing.service.InterestCalculator;
import com.hlms.domain.servicing.service.PrepaymentCalculator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class to register pure domain services as Spring beans.
 * This keeps domain modules framework-agnostic while enabling dependency injection.
 */
@Configuration
public class DomainServiceConfig {

    @Bean
    public CustomerDomainService customerDomainService() {
        return new CustomerDomainService();
    }

    @Bean
    public LoanDomainService loanDomainService() {
        return new LoanDomainService();
    }

    @Bean
    public PropertyDomainService propertyDomainService() {
        return new PropertyDomainService();
    }

    @Bean
    public DisbursementDomainService disbursementDomainService() {
        return new DisbursementDomainService();
    }

    @Bean
    public EmiCalculator emiCalculator() {
        return new EmiCalculator();
    }

    @Bean
    public InterestCalculator interestCalculator() {
        return new InterestCalculator();
    }

    @Bean
    public PrepaymentCalculator prepaymentCalculator() {
        return new PrepaymentCalculator();
    }

    @Bean
    public AmortizationScheduleGenerator amortizationScheduleGenerator(EmiCalculator emiCalculator) {
        return new AmortizationScheduleGenerator(emiCalculator);
    }

    @Bean
    public DpdCalculator dpdCalculator() {
        return new DpdCalculator();
    }

    @Bean
    public NpaClassifier npaClassifier() {
        return new NpaClassifier();
    }

    @Bean
    public ProvisioningCalculator provisioningCalculator() {
        return new ProvisioningCalculator();
    }
}
