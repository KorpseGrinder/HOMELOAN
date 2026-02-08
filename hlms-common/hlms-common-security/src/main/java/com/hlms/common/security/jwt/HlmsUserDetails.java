package com.hlms.common.security.jwt;

import com.hlms.common.util.enums.Permission;
import com.hlms.common.util.enums.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

public class HlmsUserDetails implements UserDetails {

    private final Long userId;
    private final String username;
    private final String password;
    private final String fullName;
    private final String branchCode;
    private final Set<Role> roles;
    private final Set<Permission> permissions;
    private final boolean enabled;

    public HlmsUserDetails(Long userId, String username, String password, String fullName,
                           String branchCode, Set<Role> roles, Set<Permission> permissions, boolean enabled) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.branchCode = branchCode;
        this.roles = roles;
        this.permissions = permissions;
        this.enabled = enabled;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> auths = new ArrayList<>();
        roles.forEach(r -> auths.add(new SimpleGrantedAuthority("ROLE_" + r.name())));
        permissions.forEach(p -> auths.add(new SimpleGrantedAuthority(p.name())));
        return auths;
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return username; }

    @Override
    public boolean isEnabled() { return enabled; }

    public Long getUserId() { return userId; }

    public String getFullName() { return fullName; }

    public String getBranchCode() { return branchCode; }

    public Set<Role> getRoles() { return roles; }

    public Set<Permission> getPermissions() { return permissions; }
}
