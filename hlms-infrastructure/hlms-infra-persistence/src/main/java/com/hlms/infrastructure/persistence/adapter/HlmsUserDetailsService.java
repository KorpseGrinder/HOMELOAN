package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.security.jwt.HlmsUserDetails;
import com.hlms.common.util.enums.Permission;
import com.hlms.common.util.enums.Role;
import com.hlms.infrastructure.persistence.entity.admin.UserMasterJpaEntity;
import com.hlms.infrastructure.persistence.repository.UserMasterJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class HlmsUserDetailsService implements UserDetailsService {

    private final UserMasterJpaRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserMasterJpaEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        boolean enabled = user.getIsActive() != null && user.getIsActive();
        boolean accountNonLocked = user.getAccountLocked() == null || !user.getAccountLocked();

        Set<Role> roles = EnumSet.of(Role.SYSTEM_ADMIN);
        Set<Permission> permissions = EnumSet.allOf(Permission.class);

        return new HlmsUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getFirstName() + " " + user.getLastName(),
                user.getBranchCode(),
                roles,
                permissions,
                enabled && accountNonLocked
        );
    }
}
